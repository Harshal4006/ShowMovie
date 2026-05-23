import { describe, it, expect } from 'vitest';
import {
  makeSeatId,
  buildSeatIds,
  formatShowDate,
  normalizeTimeString,
  timeToMinutes,
  getShowTimeLabel,
  getSeatTier,
} from '../../Components/SeatLayout/hooks/seatLayoutUtils';

describe('seatLayoutUtils', () => {
  describe('makeSeatId', () => {
    it('combines row letter and seat number', () => {
      expect(makeSeatId('A', 1)).toBe('A1');
      expect(makeSeatId('B', 10)).toBe('B10');
    });
  });

  describe('buildSeatIds', () => {
    it('generates all seat IDs for given rows and seats per row', () => {
      const rows = ['A', 'B'];
      const seats = buildSeatIds(rows, 3);
      expect(seats).toEqual(['A1', 'A2', 'A3', 'B1', 'B2', 'B3']);
    });
  });

  describe('formatShowDate', () => {
    it('formats a valid date string', () => {
      const result = formatShowDate('2026-05-23T10:30:00Z');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('returns empty string for null input', () => {
      expect(formatShowDate(null)).toBe('');
    });

    it('returns the original string for invalid dates', () => {
      expect(formatShowDate('not-a-date')).toBe('not-a-date');
    });
  });

  describe('normalizeTimeString', () => {
    it('trims and uppercases', () => {
      expect(normalizeTimeString(' 10:30 pm ')).toBe('10:30 PM');
    });

    it('returns empty for falsy input', () => {
      expect(normalizeTimeString('')).toBe('');
      expect(normalizeTimeString(null)).toBe('');
    });
  });

  describe('timeToMinutes', () => {
    it('converts AM time correctly', () => {
      expect(timeToMinutes('10:30 AM')).toBe(630);
    });

    it('converts PM time correctly', () => {
      expect(timeToMinutes('10:30 PM')).toBe(1350);
      expect(timeToMinutes('12:00 PM')).toBe(720);
    });

    it('converts midnight correctly', () => {
      expect(timeToMinutes('12:00 AM')).toBe(0);
    });

    it('returns null for invalid format', () => {
      expect(timeToMinutes('invalid')).toBeNull();
      expect(timeToMinutes('25:00 AM')).toBeNull();
    });

    it('handles single-digit hour', () => {
      expect(timeToMinutes('9:05 AM')).toBe(545);
    });
  });

  describe('getShowTimeLabel', () => {
    it('returns formatted time from ISO string', () => {
      const result = getShowTimeLabel('2026-05-23T14:30:00Z');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('returns empty string for invalid input', () => {
      expect(getShowTimeLabel('')).toBe('');
      expect(getShowTimeLabel(null)).toBe('');
    });
  });

  describe('getSeatTier', () => {
    it('returns Premium for A, B, C rows', () => {
      expect(getSeatTier('A')).toBe('Premium');
      expect(getSeatTier('B')).toBe('Premium');
      expect(getSeatTier('C')).toBe('Premium');
    });

    it('returns Standard for D, E, F rows', () => {
      expect(getSeatTier('D')).toBe('Standard');
      expect(getSeatTier('E')).toBe('Standard');
      expect(getSeatTier('F')).toBe('Standard');
    });

    it('returns Economy for other rows', () => {
      expect(getSeatTier('G')).toBe('Economy');
      expect(getSeatTier('H')).toBe('Economy');
    });
  });
});
