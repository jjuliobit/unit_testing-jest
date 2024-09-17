import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { mapPerson } from "../src/person";

describe('Person Test Suite', () => {
    describe('happy path', () => {
        it('should map person', () => {
            const personStr = '{"name": "erickwendel", "age":28}'
            const personObj = mapPerson(personStr)
            expect(personObj).toEqual({
                name: 'erickwendel',
                age: 28,
                createdAt: expect.any(Date)
            })
        })
    })

    describe('what coverge doesnt tell you', () => {
        it('should not map person given invalid JSON String', () => {
            const personStr = '{"name":'
            expect(() => mapPerson(personStr)).toThrow('Unexpected end of JSON input')
        })
        it('should not map person given invalid JSON data', () => {
            const personStr = '{}'
            const personObj = mapPerson(personStr)
            expect(personObj).toEqual({
                name: undefined,
                age: undefined,
                createdAt: expect.any(Date)
            })
        })
    })
})