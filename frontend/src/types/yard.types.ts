export interface YardCell {
  id: string;
  zone: string;
  row: number;
  col: number;
  layer: number;
  isOccupied: boolean;
  structureId?: string;
  structure?: {
    id: string;
    name: string;
    code: string;
    type: string;
    weight: number;
    quantity: number;
  };
  weight: number;
  status: 'empty' | 'occupied' | 'reserved' | 'warning';
}

export interface YardStats {
  totalCells: number;
  occupiedCells: number;
  emptyCells: number;
  occupancyRate: number;
  totalWeight: number;
  warningCells: number;
}

export interface YardPosition {
  id: string;
  zone: string;
  row: number;
  col: number;
  layer: number;
  structureId?: string;
  status: string;
}
