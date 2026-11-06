import { test, expect } from "bun:test";
import { Ship } from "./ship.js";

test("a new ship keeps its length", () => {
  const ship = new Ship(3);
  expect(ship.length).toBe(3);
});

test("a new ship is not sunk", () => {
  const ship = new Ship(3);
  expect(ship.isSunk()).toBe(false);
});

test("a ship is not sunk while hits are below its length", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});

test("a ship sinks when hits reach its length", () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("extra hits do not unsink a ship", () => {
  const ship = new Ship(2);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("a one-cell ship sinks after one hit", () => {
  const ship = new Ship(1);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
