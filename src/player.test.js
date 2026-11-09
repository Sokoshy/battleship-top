import { test, expect } from "bun:test";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

test("a player keeps its name", () => {
  const player = new Player("Sokoslay");
  expect(player.name).toBe("Sokoslay");
});

test("a player has its own empty board", () => {
  const player = new Player("Sokoslay");
  expect(player.board).toBeInstanceOf(Gameboard);
  expect(player.board.shipPos).toEqual([]);
  expect(player.board.missedAttacks).toEqual([]);
  expect(player.board.allSunk()).toBe(false);
});

test("two players have independent boards", () => {
  const first = new Player("First");
  const second = new Player("Second");

  first.placeShip(new Ship(1), [[0, 0]]);

  expect(first.board.shipPos.length).toBe(1);
  expect(second.board.shipPos.length).toBe(0);
  expect(second.board.allSunk()).toBe(false);
});

test("placeShip delegates to the player's own board", () => {
  const player = new Player("Sokoslay");

  player.placeShip(new Ship(2), [[1, 1], [1, 2]]);

  expect(player.board.shipPos.length).toBe(1);
  expect(player.board.grid[1][1]).toBe(player.board.shipPos[0].ship);
});

test("attack sends the shot to the opponent board", () => {
  const attacker = new Player("Attacker");
  const defender = new Player("Defender");

  const result = attacker.attack(defender.board, [0, 0]);

  expect(result).toBe("miss");
  expect(defender.board.missedAttacks).toEqual([[0, 0]]);
  expect(attacker.board.missedAttacks).toEqual([]);
});

test("attack propagates hit and sinks the opponent ship", () => {
  const attacker = new Player("Attacker");
  const defender = new Player("Defender");
  const ship = new Ship(1);
  defender.placeShip(ship, [[2, 2]]);

  expect(attacker.attack(defender.board, [2, 2])).toBe("hit");
  expect(ship.isSunk()).toBe(true);
  expect(defender.board.allSunk()).toBe(true);
});

test("attack propagates already for a repeated hit", () => {
  const attacker = new Player("Attacker");
  const defender = new Player("Defender");
  defender.placeShip(new Ship(2), [[0, 0], [0, 1]]);

  expect(attacker.attack(defender.board, [0, 0])).toBe("hit");
  expect(attacker.attack(defender.board, [0, 0])).toBe("already");
});

test("attack propagates already for a repeated miss", () => {
  const attacker = new Player("Attacker");
  const defender = new Player("Defender");

  expect(attacker.attack(defender.board, [4, 4])).toBe("miss");
  expect(attacker.attack(defender.board, [4, 4])).toBe("already");
  expect(defender.board.missedAttacks).toEqual([[4, 4]]);
});

test("attack on outside the board throws an error", () => {
  const attacker = new Player("Attacker");
  const defender = new Player("Defender");

  expect(() => attacker.attack(defender.board, [10, 0])).toThrow();
});

test("placeShip outside the board throws an error", () => {
  const player = new Player("Sokoslay");

  expect(() => player.placeShip(new Ship(1), [[10, 0]])).toThrow();
});
