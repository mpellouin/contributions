export interface HeatmapStyle {
  colorscale: string;
  paper_bgcolor: string;
  plot_bgcolor: string;
  font_color: string;
  title_color: string;
}

export const HEATMAP_STYLES: Record<string, HeatmapStyle> = {
  default: {
    colorscale: 'Greens',
    paper_bgcolor: '#31363F',
    plot_bgcolor: '#222831',
    font_color: '#EEEEEE',
    title_color: '#EEEEEE',
  },
  github: {
    colorscale: 'Greens',
    paper_bgcolor: '#0d1117',
    plot_bgcolor: '#010409',
    font_color: '#c9d1d9',
    title_color: '#58a6ff',
  },
  blue: {
    colorscale: 'Blues',
    paper_bgcolor: '#1e3a5f',
    plot_bgcolor: '#0f1f38',
    font_color: '#e0e7ff',
    title_color: '#93c5fd',
  },
  purple: {
    colorscale: 'Purples',
    paper_bgcolor: '#2e1065',
    plot_bgcolor: '#1e0a46',
    font_color: '#f3e8ff',
    title_color: '#c084fc',
  },
  warm: {
    colorscale: 'YlOrRd',
    paper_bgcolor: '#451a03',
    plot_bgcolor: '#292524',
    font_color: '#fef3c7',
    title_color: '#fbbf24',
  },
  cool: {
    colorscale: 'Teal',
    paper_bgcolor: '#042f2e',
    plot_bgcolor: '#022c22',
    font_color: '#ccfbf1',
    title_color: '#5eead4',
  },
  light: {
    colorscale: 'Greens',
    paper_bgcolor: '#f8fafc',
    plot_bgcolor: '#ffffff',
    font_color: '#334155',
    title_color: '#0f172a',
  },
  grayscale: {
    colorscale: 'Greys',
    paper_bgcolor: '#27272a',
    plot_bgcolor: '#18181b',
    font_color: '#e4e4e7',
    title_color: '#fafafa',
  },
};

export function getHeatmapStyle(styleName: string | undefined): HeatmapStyle {
  if (!styleName || !HEATMAP_STYLES[styleName]) {
    return HEATMAP_STYLES.default;
  }
  return HEATMAP_STYLES[styleName];
}

export function getAvailableStyles(): string[] {
  return Object.keys(HEATMAP_STYLES);
}
