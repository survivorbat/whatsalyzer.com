import WhatsappData from '../../logic/whatsapp-data';

export interface DefaultProps {
  data: WhatsappData;
}

export interface CloudChartProps {
  data: WhatsappData;
  minFrequency: number;
  minLength?: number;
  minFontSize: number;
  maxFontSize: number;
}

export interface UsageTableProps {
  data: WhatsappData;
  minLength: number;
  displayAmount: number;
}
