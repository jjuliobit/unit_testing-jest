import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals'
import Person from '../src/person.js'

function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
        server.once('error', (err) => reject(err))
        server.once('listening', () => resolve())
    })
}

describe('E2E Test Suite', () => {
    describe('E2e Tests for Server in a non-test env', () => {
        it('should start server with PORT 4000', async () => {
            const PORT = 4000
            process.env.NODE_ENV = 'production'
            process.env.PORT = PORT
            jest
                .spyOn(
                    console,
                    console.log.name
                )


            const { default: server } = await import('../src/index.js')
            await waitForServerStatus(server)

            const serverInfo = server.address()
            expect(serverInfo.port).toBe(4000)
            expect(console.log).toHaveBeenCalledWith(
                `server is running at ${serverInfo.address}:${serverInfo.port}`
            )

            return new Promise(resolve => server.close(resolve))
        })
    })

    describe('E2E Tests for Server', () => {
        let _testServer
        let _testServerAddress

        beforeAll(async () => {
            process.env.NODE_ENV = 'test'
            const { default: server } = await import('../src/index.js')
            _testServer = server.listen();

            await waitForServerStatus(_testServer)

            const serverInfo = _testServer.address()
            _testServerAddress = `http://localhost:${serverInfo.port}`

        })

        // afterAll(done => _testServer.close(done))

        it('should return 404 for unsupported routes', async () => {
            const response = await fetch(`${_testServerAddress}/unsupported`, {
                method: 'POST'
            })
            expect(response.status).toBe(404)
        })

        it('should return 400 and missing field message when body cpf is invalid', async () => {
            const invalidPerson = { name: 'Fulano da Silva' } // Missing CPF

            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify(invalidPerson)
            })
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.validationError).toEqual('cpf is required')
        })

        it('should return 400 and missing field message when body name is invalid', async () => {
            const invalidPerson = { cpf: '123.123.123-11' } // Missing Name

            const response = await fetch(`${_testServerAddress}/persons`, {
                method: 'POST',
                body: JSON.stringify(invalidPerson)
            })
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.validationError).toEqual('name is required')
        })

        it('should format the person name and CPF', () => {
            // AAA

            // Arrange
            const MockPerson = {
                name: 'Julia do Hulk',
                cpf: '123.456.789-12'
            }

            // Act
            const formattedPerson = Person.format(MockPerson)

            const expected = {
                name: 'Julia',
                cpf: '12345678912',
                lastName: 'do Hulk'
            }

            // Assert
            expect(formattedPerson).toEqual(expected)
        })

        it('should throw an error when saving an invalid person', () => {
            // Arrange
            const invalidPerson = {};

            // Act & Assert
            expect(() => Person.save(invalidPerson)).toThrowError(
                new Error(`cannot save invalid person: ${JSON.stringify(invalidPerson)}`)
            );
        });

        it('should save the person name, last name and CPF', () => {
            jest.restoreAllMocks();
            // AAA

            // Arrange
            const MockPerson = {
                name: 'Julia',
                cpf: '123.456.789-12',
                lastName: 'do Hulk'
            }

            jest.spyOn(
                console,
                console.log.name
            )

            jest.spyOn(
                Person,
                Person.format.name
            ).mockReturnValue({
                cpf: '12345678912',
                name: 'Julia',
                lastName: 'do Hulk'
            })

            jest.spyOn(
                Person,
                Person.save.name
            )

            const formatted = Person.format(MockPerson)

            // Act
            const savedPerson = Person.save(formatted)


            // Assert
            expect(formatted).toEqual(savedPerson)
            expect(console.log).toHaveBeenCalledWith('registrado com sucesso!!', savedPerson)


        })
    })

})

