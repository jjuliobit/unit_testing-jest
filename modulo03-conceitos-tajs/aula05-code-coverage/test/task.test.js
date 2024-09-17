import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Task from "../src/task";
import { setTimeout } from 'node:timers/promises'

describe('Task Test Suite', () => {
    let _logMock;
    let _task
    beforeEach(() => {
        _logMock = jest.spyOn(
            console,
            console.log.name
        ).mockImplementation();

        _task = new Task()
    })

    it('should only tasks that are due whith fake timers (fast)', async () => {
        jest.useFakeTimers()

        // AAA - Arrange - Act - Assert

        // Arrange
        const tasks = [
            {
                name: 'Task-Will-Run-In-5-Secs',
                dueAt: new Date(Date.now() + 5000),
                fn: jest.fn()
            },
            {
                name: 'Task-Will-Run-In-10-Secs',
                dueAt: new Date(Date.now() + 10000),
                fn: jest.fn()
            },
        ]

        // Act
        _task.save(tasks.at(0))
        _task.save(tasks.at(1))

        _task.run(200) // 200ms

        jest.advanceTimersByTime(4000)

        // ninguem deve ser executado ainda!
        expect(tasks.at(0).fn).not.toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        jest.advanceTimersByTime(2000)

        // 4 + 2 = 6 só a primeira tarefa deve executar
        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        jest.advanceTimersByTime(4000)

        // 4 + 2 + 4 = 10 só a primeira tarefa deve executar
        expect(tasks.at(1).fn).toHaveBeenCalled()

        jest.useRealTimers()
    })
})