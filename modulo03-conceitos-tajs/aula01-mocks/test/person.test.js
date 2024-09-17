import { it, describe, expect, jest } from "@jest/globals";
import Person from "../src/person";


describe("#Person Suite", () => {
    describe("#validate", () => {
        it("should throw if the name is not present ", () => {
            // mock é a entrada necessaria para que o teste funcione
            const mockInvalidPerson = {
                name: "",
                cpf: "123.456.789-00"
            }
            expect(() => Person.validate(mockInvalidPerson)).toThrow(new Error('name is required'));
        })

        it("should throw if the cpf is not present ", () => {
            // mock é a entrada necessaria para que o teste funcione
            const mockInvalidPerson = {
                name: "Jhon",
                cpf: ""
            }
            expect(() => Person.validate(mockInvalidPerson)).toThrow(new Error('cpf is required'));
        })

        it("should not throw person is valid ", () => {
            // mock é a entrada necessaria para que o teste funcione
            const mockInvalidPerson = {
                name: "Jhon",
                cpf: "123.456.789-00"
            }
            expect(() => Person.validate(mockInvalidPerson)).not.toThrow();
        })
    });

    describe('#format', () => {
        // parte do principio que os dados ja foram validados
        it('should format the person name and CPF', () => {
            // AAA

            // Arrange = Prepara
            const mockPerson = {
                name: 'Xuxa da Silva',
                cpf: '000.999.444-11'
            }
            // Act = Executar
            const formmattedPerson = Person.format(mockPerson)

            // Assert = Validar
            const expected = {
                name: 'Xuxa',
                cpf: '00099944411',
                lastName: 'da Silva'
            }

            expect(formmattedPerson).toStrictEqual(expected)
        })
    })

    describe('#process', () => {
        // parte do principio que os dados ja foram validados
        it('should process a valid person', () => {
            // Uma outra ideia é nao retestar o que já foi testado

            // lembra dos checkpoints?
            // Testou do caminho A ao caminho B,
            //      agora testa do caminho B ao caminho C
            // Então aqui, eu pulo o caminho A (validate), caminho B (format)
            // e vou direto para o caminho C (save) pois estes caminhos
            // já foram validados

            // Este método abaixo faz mais sentido para quando se tem interações externas como
            // chamadas de API, banco de dados, etc (que será mostrado na proxima aula)

            // Mock sao simulações de funções que você pode fazer ao testar o comportamento!!

            // AAA = ARRANGE, Act, Assert

            // Arrange
            const mockPerson = {
                name: 'Zezin da Silva',
                cpf: '123.456.789-00'
            }

            jest
                .spyOn(
                    Person,
                    Person.validate.name
                )

                .mockReturnValue()
            // .mockImplementation(() => {
            //     throw new Error('Deu ruim!!')
            // })

            jest
                .spyOn(
                    Person,
                    Person.format.name
                )

                .mockReturnValue({
                    cpf: '12345678900',
                    name: 'Zezin',
                    lastName: 'da Silva'
                })
            //Act
            const result = Person.process(mockPerson)

            // Assert
            const expected = 'ok'
            expect(result).toStrictEqual(expected)
        })
    })

})
