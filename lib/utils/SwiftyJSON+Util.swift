//
//  SwiftyJSON+Util.swift
//  Product
//
//  Created by muukii on 3/16/16.
//  Copyright © 2016 eure. All rights reserved.
//

import Foundation
import SwiftyJSON

extension JSON {
    
    var ISO8601: NSDate? {
        get {
            switch self.type {
            case .String:
                return (self.object as? String)
                    .flatMap { JSON.ISO8601Formatter.dateFromString($0) ?? JSON.ISO8601TimezoneFormatter.dateFromString($0) }
            default:
                return nil
            }
        }
        set {
            if let newValue = newValue {
                self.object = JSON.ISO8601Formatter.stringFromDate(newValue)
            } else {
                self.object = NSNull()
            }
        }
    }
    
    @nonobjc private static var ISO8601Formatter: NSDateFormatter = {
        // http://unicode.org/reports/tr35/tr35-10.html#Date_Format_Patterns
        let formatter = NSDateFormatter()
        formatter.locale = NSLocale(localeIdentifier: "en_US_POSIX")
        formatter.timeZone = NSTimeZone(name: "UTC")
        formatter.calendar = NSCalendar(calendarIdentifier: NSCalendarIdentifierGregorian)
        
        formatter.dateFormat = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        
        return formatter
    }()
    
    @nonobjc private static var ISO8601TimezoneFormatter: NSDateFormatter = {
        // http://unicode.org/reports/tr35/tr35-10.html#Date_Format_Patterns
        let formatter = NSDateFormatter()
        formatter.calendar = NSCalendar(calendarIdentifier: NSCalendarIdentifierGregorian)
        
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZ"
        
        return formatter
    }()
}

// Accessor Methods

extension JSON {
    
    public init(_ short: Int16) {
        self.init(NSNumber(short: short))
    }
    
    public init(_ int: Int32) {
        self.init(NSNumber(int: int))
    }
    
    public init(_ longLong: Int64) {
        self.init(NSNumber(longLong: longLong))
    }
    
    public var dictionaryObjectNoNullValues: [String : AnyObject]? {
        
        guard let dictionary = self.dictionaryObject else {
            return nil
        }
        
        var newDictionary = [String : AnyObject]()

        dictionary.forEach { key, value in
            
            if value is NSNull {
                return
            }
            newDictionary[key] = value
        }
        
        return newDictionary
    }
    
    func getString() throws -> String {
        try checkError()
        return try unwrap(self.string)
    }
    
    func getInt() throws -> Int {
        try checkError()
        return try unwrap(self.int)
    }
    
    func getInt32() throws -> Int32 {
        try checkError()
        return try unwrap(self.int32)
    }
    
    func getInt64() throws -> Int64 {
        try checkError()
        return try unwrap(self.int64)
    }
    
    func getDouble() throws -> Double {
        try checkError()
        return try unwrap(self.double)
    }
    
    func getBool() throws -> Bool {
        try checkError()
        return try unwrap(self.bool)
    }
    
    func getNSDate() throws -> NSDate {
        try checkError()
        return try unwrap(self.ISO8601)
    }
    
    func getURL() throws -> NSURL {
        try checkError()
        return try unwrap(self.URL)
    }
    
    func getArray() throws -> [JSON] {
        try checkError()
        return try unwrap(self.array)
    }

    func getInt64Array() throws -> [Int64] {
        
        let array = try unwrap(self.array)
        
        return try array.map { json -> Int64 in
            return try unwrap(json.int64)
        }
    }
    
    func getObject<T: _InitializableFromJSON>(toType: T.Type) throws -> T {
        let object = try toType.init(json: self)
        return object
    }
    
    func getObjects<T: _InitializableFromJSON>(toType: T.Type) throws -> [T] {
        let array = try unwrap(self.array)
        let objects = try array.map { try toType.init(json: $0) }
        return objects
    }

    private func checkError() throws {
        if let error = self.error {
            throw error
        }
    }
    
    private func unwrap<T>(object: T?) throws -> T {
        guard let wrappedObject = object else {
            throw self.error!
        }
        return wrappedObject
    }        
}

protocol _InitializableFromJSON {
    
    init(json: JSON) throws
}

protocol _EncodableToJSON {
    func toJSON() -> JSON
}
