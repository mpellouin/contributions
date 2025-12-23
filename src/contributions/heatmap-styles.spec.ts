import { getHeatmapStyle, getAvailableStyles, HEATMAP_STYLES } from './heatmap-styles';

describe('HeatmapStyles', () => {
  describe('getHeatmapStyle', () => {
    it('should return default style when no style name is provided', () => {
      const result = getHeatmapStyle(undefined);
      expect(result).toEqual(HEATMAP_STYLES.default);
    });

    it('should return default style when invalid style name is provided', () => {
      const result = getHeatmapStyle('nonexistent');
      expect(result).toEqual(HEATMAP_STYLES.default);
    });

    it('should return github style when "github" is provided', () => {
      const result = getHeatmapStyle('github');
      expect(result).toEqual(HEATMAP_STYLES.github);
      expect(result.colorscale).toBe('Greens');
      expect(result.paper_bgcolor).toBe('#0d1117');
    });

    it('should return blue style when "blue" is provided', () => {
      const result = getHeatmapStyle('blue');
      expect(result).toEqual(HEATMAP_STYLES.blue);
      expect(result.colorscale).toBe('Blues');
    });

    it('should return purple style when "purple" is provided', () => {
      const result = getHeatmapStyle('purple');
      expect(result).toEqual(HEATMAP_STYLES.purple);
      expect(result.colorscale).toBe('Purples');
    });

    it('should return warm style when "warm" is provided', () => {
      const result = getHeatmapStyle('warm');
      expect(result).toEqual(HEATMAP_STYLES.warm);
      expect(result.colorscale).toBe('YlOrRd');
    });

    it('should return cool style when "cool" is provided', () => {
      const result = getHeatmapStyle('cool');
      expect(result).toEqual(HEATMAP_STYLES.cool);
      expect(result.colorscale).toBe('Teal');
    });

    it('should return light style when "light" is provided', () => {
      const result = getHeatmapStyle('light');
      expect(result).toEqual(HEATMAP_STYLES.light);
      expect(result.colorscale).toBe('Greens');
      expect(result.paper_bgcolor).toBe('#f8fafc');
    });

    it('should return grayscale style when "grayscale" is provided', () => {
      const result = getHeatmapStyle('grayscale');
      expect(result).toEqual(HEATMAP_STYLES.grayscale);
      expect(result.colorscale).toBe('Greys');
    });
  });

  describe('getAvailableStyles', () => {
    it('should return all available style names', () => {
      const result = getAvailableStyles();
      expect(result).toContain('default');
      expect(result).toContain('github');
      expect(result).toContain('blue');
      expect(result).toContain('purple');
      expect(result).toContain('warm');
      expect(result).toContain('cool');
      expect(result).toContain('light');
      expect(result).toContain('grayscale');
      expect(result.length).toBe(8);
    });
  });

  describe('All styles', () => {
    it('should have all required properties', () => {
      const styles = Object.values(HEATMAP_STYLES);
      styles.forEach((style) => {
        expect(style).toHaveProperty('colorscale');
        expect(style).toHaveProperty('paper_bgcolor');
        expect(style).toHaveProperty('plot_bgcolor');
        expect(style).toHaveProperty('font_color');
        expect(style).toHaveProperty('title_color');
      });
    });
  });
});
