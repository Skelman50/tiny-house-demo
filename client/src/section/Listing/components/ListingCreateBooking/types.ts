export interface BookingIndexMonth {
  [key: string]: boolean;
}

export interface BookingIndexYear {
  [key: string]: BookingIndexMonth;
}

export interface BookingIndex {
  [key: string]: BookingIndexYear;
}
