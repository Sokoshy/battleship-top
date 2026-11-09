import { test, expect, describe } from "bun:test";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

test("a board with no ships is not considered all sunk", () => {
  const board = new Gameboard(5);
  expect(board.allSunk()).toBe(false);
});

test("a placed ship is not sunk until all its cells are hit", () => {
  const board = new Gameboard(5);
  const ship = new Ship(2);
  board.placeShip(ship, [[1, 1], [1, 2]]);

  expect(board.receiveAttack([1, 1])).toBe("hit");
  expect(ship.isSunk()).toBe(false);
  expect(board.allSunk()).toBe(false);

  expect(board.receiveAttack([1, 2])).toBe("hit");
  expect(ship.isSunk()).toBe(true);
  expect(board.allSunk()).toBe(true);
});

test("a shot on water is a miss and is recorded", () => {
  const board = new Gameboard(5);

  expect(board.receiveAttack([4, 4])).toBe("miss");
  expect(board.missedAttacks).toEqual([[4, 4]]);
});

test("a hit is not recorded as a missed attack", () => {
  const board = new Gameboard(5);
  board.placeShip(new Ship(1), [[2, 2]]);

  board.receiveAttack([2, 2]);
  expect(board.missedAttacks).toEqual([]);
});

test("attacking the same cell twice does not hit the ship twice", () => {
  const board = new Gameboard(5);
  const ship = new Ship(2);
  board.placeShip(ship, [[1, 1], [1, 2]]);

  expect(board.receiveAttack([1, 1])).toBe("hit");
  expect(board.receiveAttack([1, 1])).toBe("already");
  expect(ship.isSunk()).toBe(false);
  expect(board.receiveAttack([1, 2])).toBe("hit");
  expect(ship.isSunk()).toBe(true);
});

test("a repeated miss is only recorded once", () => {
  const board = new Gameboard(5);

  expect(board.receiveAttack([4, 4])).toBe("miss");
  expect(board.receiveAttack([4, 4])).toBe("already");
  expect(board.missedAttacks).toEqual([[4, 4]]);
});

test("allSunk stays false while another ship is afloat", () => {
  const board = new Gameboard(5);
  const first = new Ship(1);
  const second = new Ship(1);
  board.placeShip(first, [[0, 0]]);
  board.placeShip(second, [[0, 1]]);

  board.receiveAttack([0, 0]);
  expect(board.allSunk()).toBe(false);

  board.receiveAttack([0, 1]);
  expect(board.allSunk()).toBe(true);
});

test("attacking outside the board throws an error", () => {
  const board = new Gameboard(5);

  expect(() => board.receiveAttack([5, 0])).toThrow();
  expect(() => board.receiveAttack([0, 5])).toThrow();
  expect(() => board.receiveAttack([-1, 0])).toThrow();
  expect(() => board.receiveAttack([0, -1])).toThrow();
});

test("placing a ship outside the board throws an error", () => {
  const board = new Gameboard(5);
  const ship = new Ship(2);

  expect(() => board.placeShip(ship, [[0, 0], [0, 5]])).toThrow();
  expect(() => board.placeShip(new Ship(1), [[5, 0]])).toThrow();
  expect(() => board.placeShip(new Ship(1), [[-1, 0]])).toThrow();
});

describe("See if get methode return a copy of the original array", () => {
  const board = new Gameboard(5);
  const first = new Ship(1);
  const second = new Ship(1);
  board.placeShip(first, [[0, 0]]);
  board.placeShip(second, [[0, 1]]);
  board.receiveAttack([4, 4]);
  board.receiveAttack([0, 1]);


  test("test getMissedAttacks()", () => {
    expect(board.getMissedAttacks()).not.toBe(board.missedAttacks);
    expect(board.getMissedAttacks()).toEqual(board.missedAttacks);
  });
  test("test getHits()", () => {
    expect(board.getHits()).not.toBe(board.alreadyHit);
    expect(board.getHits()).toEqual(board.alreadyHit);
  });
  test("test getShipPlacements()", () => {
    expect(board.getShipPlacements()).not.toBe(board.shipPos);
    expect(board.getShipPlacements()).toEqual(board.shipPos);
  });
})
