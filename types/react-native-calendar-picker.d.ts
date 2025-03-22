declare module 'react-native-calendar-picker' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  interface CalendarPickerProps {
    onDateChange: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
    width?: number;
    todayBackgroundColor?: string;
    selectedDayColor?: string;
    selectedDayTextColor?: string;
    textStyle?: TextStyle;
    containerStyle?: ViewStyle;
  }

  export default class CalendarPicker extends Component<CalendarPickerProps> {}
} 