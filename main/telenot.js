const utilFunc = require('../util/common');
const config = require('./../config/config');
const net = require('net');

//  Set to retain messages on MQTT
const publishOptions={
  retain:true
};

const timeout = 15000;
const COMMAND_USED_STATE   = "680909687302051000000071241f16";
const COMMAND_SB_STATE_ON  = "680909687301050200";
const COMMAND_SB_STATE_OFF = "680909687300050200";

module.exports = class Telenot {
  constructor(logger, mqttHandler) {
    this.logger = logger;
    this.mqttClient = mqttHandler.mqttClient;
    // this.binaryDiscoverPrevious = {};
    this.statesPrevious = {};
    
    // subscribe to MQTT control topics
    this.mqttClient.subscribe(config.Connection.mqttConfig.publishTopic, (err) => {
      if (!err) {
        // publish all current states   
        this.logger.info('MQTT subscribed to '+ config.Connection.mqttConfig.publishTopic);       
      } else if (err) {
        this.logger.error(JSON.stringify(err));
      }
    }); // end subscribe republish
    this.mqttClient.subscribe(config.Connection.mqttConfig.commandTopic, (err) => {
      if (!err) {
        // receive commands
        this.logger.info('MQTT subscribed to '+ config.Connection.mqttConfig.commandTopic);       
      } else if (err) {
        this.logger.error(JSON.stringify(err));
      }
    }); // end subscribe command

    /*
    this.mqttClient.subscribe(config.Connection.mqttConfig.publishTopic, (err) => {
      if (!err) {
        // ackowledge
      }
      this.logger.verbose('MQTT subscribed to '+ config.Connection.mqttConfig.publishTopic);       
    });
    */

    this.mqttClient.on('message', (topic, msg) => {

      this.logger.verbose(`Received message ${msg} `);

      switch (topic)
      {
        case config.Connection.mqttConfig.publishTopic:
          // got message to send all states
          this.logger.verbose(`Received message on topic ${topic} to send current states`);          
          this.publish(config.Telenot.MELDEBEREICHE.name);
          this.publish(config.Telenot.MELDEGRUPPEN.name);
          break;
        case config.Connection.mqttConfig.commandTopic:
          // got message send a command to telenot unit
          this.logger.verbose(`Received message on topic ${topic} to send command ${msg} to the telenot`);    

          switch (msg+"")
          {
            case 'DISARM':
              this.logger.verbose(`DISARMing telenot: `+ this.disarmArea(1));
              this.sendCommand(this.disarmArea(1));
              break;
            case 'ARM_HOME':
              this.logger.verbose(`Interal ARM telenot: `+ this.intArmArea(1));
              this.sendCommand(this.intArmArea(1));
              break;
            case 'ARM_AWAY':
              this.logger.verbose(`External ARM telenot: `+ this.extArmArea(1));
              this.sendCommand(this.extArmArea(1));
              break;
            default:
              break;
          }
          break;
        default:
          this.logger.verbose(`Received message on topic ${topic} which don't have any use for`);          
          break;
      }
      
    });
    return this;
  }

  /**
   * Publish all current states
   * This is needed, e.g. when restarting Home Assistant to get the
   * stored values back.
   * @param {NewType} contentName
   */
  publish(contentName) {
    this.logger.debug(`Publish all states for ': ${contentName}`);
    // get saved values
    const byteMap = this.statesPrevious[contentName];
    byteMap.forEach((byteValue, byteIndex) => {
      const binaryStr = utilFunc.reverseANumber(Number(byteValue).toString(2));
      for (let bitIndex = 0; bitIndex < binaryStr.length; bitIndex += 1) {
        const seachIndex = (byteIndex * 8) + bitIndex;
        const property = config.Telenot[contentName].positions.find(
          element => element.hex === seachIndex,
        );
        const bitValue = binaryStr.charAt(bitIndex);
        if (property !== undefined && property.name !== '') {
          if (this.mqttClient.connected) {
            this.mqttClient.publish(
              property.topic,
              utilFunc.mapBinaryValue(bitValue, property.inverted),
            );
            this.logger.verbose(`Publish state for ${contentName}: ${property.name} value: ${utilFunc.mapBinaryValue(bitValue)} at position ${seachIndex}`);

            switch (property.name)
            {
              case 'Unscharf':                
                if (utilFunc.mapBinaryValue(bitValue, property.inverted) == 'OFF')
                {
                  this.logger.verbose('Telenot is reported to be unscharf, setting state topic accordingly');
                  this.mqttClient.publish('telenot/alarm/sb/int_armed', 'OFF', publishOptions);
                  this.mqttClient.publish('telenot/alarm/sb/ext_armed', 'OFF', publishOptions);
                  this.mqttClient.publish(config.Connection.mqttConfig.stateTopic, 'disarmed', publishOptions);
                }
                break;
              case 'Alarm':
                if (utilFunc.mapBinaryValue(bitValue, property.inverted) == 'OFF')
                {
                  this.logger.verbose('Telenot is reported not in alarm mode');
                  this.mqttClient.publish('telenot/alarm/sb/alarm', 'OFF', publishOptions);                  
                }
                break;
              default:
                break;
            }

          } else {
            this.logger.debug(`Cant publish state as Mqtt not connected: ${property.topic}`);
          }
        }
      }
    });
  }

  decodeHex(hex, contentName) {    

    // get binary at hex position 0XA
    //this.logger.debug(`decodeHex started - ContentName: ${contentName} `);
    const parts = hex.slice(config.Telenot[contentName].offset, hex.length);
    // create position table
    const byteMap = new Map();
    parts.forEach((value, index) => {
      byteMap.set(index, value);
    });

    if (this.statesPrevious[contentName] === undefined) {
      this.statesPrevious[contentName] = byteMap;
      // publish initial states
      byteMap.forEach((byteValue, byteIndex) => {
        const binaryStr = utilFunc.reverseANumber(Number(byteValue).toString(2));
        for (let bitIndex = 0; bitIndex < binaryStr.length; bitIndex += 1) {
          const seachIndex = (byteIndex * 8) + bitIndex;
          const property = config.Telenot[contentName].positions.find(
            element => element.hex === seachIndex,
          );
          const bitValue = binaryStr.charAt(bitIndex);
          if (property !== undefined && property.name !== '') {
            if (this.mqttClient.connected) {
              this.mqttClient.publish(
                property.topic,
                utilFunc.mapBinaryValue(bitValue, property.inverted),
              );
              this.logger.verbose(`Publish initial state for ${contentName}: ${property.name} value: ${utilFunc.mapBinaryValue(bitValue)}`);
            } else {
              this.logger.debug(`Cant publish state as Mqtt not connected: ${property.topic}`);
            }
          }
        }
      });
    } else if (this.statesPrevious[contentName] !== byteMap) {
      // find difference
      //this.logger.debug(`determining byteMap changes`);
      byteMap.forEach((byteValue, byteIndex) => {
        const binaryStr = utilFunc.reverseANumber(Number(byteValue).toString(2));
        const prevValue = this.statesPrevious[contentName].get(byteIndex);
        //this.logger.debug(`byteValue: ${byteValue} - prevValue: ${prevValue} `);
        if (prevValue && prevValue !== byteValue) {
          const prevByte = utilFunc.reverseANumber(Number(prevValue).toString(2));
          for (let bitIndex = 0; bitIndex < binaryStr.length; bitIndex += 1) {
            const seachIndex = (byteIndex * 8) + bitIndex;
            // search for this entry in config file
            const property = config.Telenot[contentName].positions.find(
              element => element.hex === seachIndex,
            );
            const bitValue = binaryStr.charAt(bitIndex);
            // store bits
            const prevBit = prevByte[bitIndex];            
            if (bitValue !== prevBit) {
              // if discover is turned on, send position      
              if (process.env.DISCOVER === 'true') {
                if (property === undefined || property.name === '') {
                  this.logger.debug(`${contentName} - Byte:${byteIndex} Bit:${bitIndex} Position:${seachIndex}: Hex: 0x${Number(seachIndex).toString(16)} Old: ${prevBit} - New ${bitValue}`);
                } else {
                  this.logger.debug(`${contentName} (${property.name}) -  Byte:${byteIndex} Bit:${bitIndex} Position:${seachIndex}: Hex: 0x${Number(seachIndex).toString(16)} Old: ${prevBit} - New ${bitValue} - INVERTED: ${property.inverted}`);
                }
              // check if there is a property defined for this position
              } else if (property !== undefined && property.name !== '') {
                if (this.mqttClient.connected) {
                  this.mqttClient.publish(
                    property.topic,
                    utilFunc.mapBinaryValue(bitValue, property.inverted),
                    publishOptions,
                  );
                  this.logger.verbose(`Publish change for ${contentName}: ${property.name} value: ${utilFunc.mapBinaryValue(bitValue)}`);
                } else {
                  this.logger.debug(`Cant publish state as Mqtt not connected: ${property.topic}`);
                }
              }
            }
          }
        }
      });
      // save new state
      this.statesPrevious[contentName] = new Map(byteMap);
    } // end elseif bytemap changed
  } // end decodehex

    
  /**
    * Construct an Telenot command (string) to disam area.
    *
    * @param address The SB area number (1-8) for the command.
    * @return string containing the constructed command or "error" if invalid SB area passed in
    */
  disarmArea(address){
    if (address < 1 || address > 8) {
      this.logger.error('Invalid parameter(s) for SB area');
      return 'error';
    }
    else
    {
      var hex = Number(1320 + (address * 8)).toString(16);
      var msg = COMMAND_SB_STATE_ON + "0" + hex + "02E1";
      msg = msg + this.checksum(msg) + "16";
      this.logger.debug('Disarm area: ' + address + " with message: " + msg)
      return msg;
    }    
  }

  /**
    * Construct an Telenot command (string) to internal arm area.
    *
    * @param address The SB area number (1-8) for the command.
    * @return string containing the constructed command or "error" if invalid SB area passed in
    */
  intArmArea(address) {
    if (address < 1 || address > 8) {
      this.logger.error('Invalid parameter(s) for SB area');
      return 'error';
    }
    else
    {
      var hex = Number(1321 + (address * 8)).toString(16);
      var msg = COMMAND_SB_STATE_ON + "0" + hex + "0262";
      msg = msg + this.checksum(msg) + "16";
      this.logger.debug('Internal arm area: ' + address + " with message: " + msg)
      return msg;
    }
  }

  /**
    * Construct an Telenot command to external arm area.
    *
    * @param address The SB area number (1-8) for the command.
    * @return string containing the constructed command or "error" if invalid SB area passed in
    */
  extArmArea(address) {
    if (address < 1 || address > 8) {
      this.logger.error('Invalid parameter(s) for SB area');
      return 'error';
    }
    else
    {
      var hex = Number(1322 + (address * 8)).toString(16);
      var msg = COMMAND_SB_STATE_ON + "0" + hex + "0261";
      msg = msg + this.checksum(msg) + "16";
      this.logger.debug('EXT_ARM security area: ' + address + " with message: " + msg)
      return msg;
    }  
  }


  // Convert a byte array to a hex string
  bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
  }

  // calculated checksum
  checksum(s) {
    var sum = "";
    var x = 0;
    var dataLength = parseInt(s.substring(2, 4), 16);
    var a = 8;

    for (var i = 0; i < dataLength; i++) {
        x = x + parseInt(s.substring(a, a + 2), 16);
        a = a + 2;
    }
    sum = Number(x).toString(16);
    sum = sum.substring(1, 3);
    return sum;
  }

  /**
    * Send Telenot command (buffer) to TCP IP Converter
    *
    * @param buffer The command string as buffer
    * @return true 
    */
  sendCommand(sendString){    
    const sendSocket  = new net.Socket();


    sendSocket.connect(
      config.Connection.telnetConfig.port,
      config.Connection.telnetConfig.host, () => {
        this.logger.verbose('Connected to TCP converter for sending');
      },
    );    


    sendSocket.on('error', function(error) { this.logger.error('Connection error in websocket to TCP Converter' + error); });

    sendSocket.on('connect',function(){      
      //this.logger.debug('Client: connection established with TCP converter, sending: ' + sendString);
        
      // Sending      
      sendSocket.write(Buffer.from(hexToBytes(sendString)));           

    });


    setTimeout(function(){
      sendSocket.end();
      sendSocket.destroy();
      //this.logger.verbose('Connection to TCP Converter for sending destroyed.');
    },timeout);

    // final step for telenot: String (with hex values) to buffer and this can be send to the TCP bridge
    function hexToBytes(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    };

  }


};
