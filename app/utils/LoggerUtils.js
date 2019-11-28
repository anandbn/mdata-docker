const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const fs = require('fs');
const path = require('path');

class LoggerUtils{

    static getLogger(source,logLevel){
        const myFormat = printf(info => {
            return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
        });
        var logFileName;
        if(process.env.LOCAL){
            logFileName = path.join('logs',source+'.log');
            console.log('logFileName:'+logFileName);
        }
        
        if(logFileName){
            return createLogger({
                level: (logLevel?logLevel:'debug'),
                format: combine(
                    label({ label: source }),
                    timestamp(),
                    myFormat
                ),
                transports: [
                    new transports.Console({colorize:true}),
                    new transports.File({ filename: logFileName })
                ]
            });
        }else{
            return createLogger({
                level: (logLevel?logLevel:'debug'),
                format: combine(
                    label({ label: source }),
                    timestamp(),
                    myFormat
                ),
                transports: [
                    new transports.Console({colorize:true})
                ]
            });            
        }
        
        return logger;                
    }
}

module.exports=LoggerUtils;