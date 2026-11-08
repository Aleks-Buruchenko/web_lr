import "@testing-library/jest-dom/vitest";
import {cleanup} from "@testing-library/react";
import {afterEach} from "vitest";

// Явная очистка DOM: Vitest по умолчанию не предоставляет глобальный afterEach.
afterEach(()=>cleanup());
