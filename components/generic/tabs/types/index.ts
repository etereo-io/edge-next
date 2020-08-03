import React from 'react';

export interface Tab {
  readonly id: string | number;
  readonly label: React.ReactNode;
  readonly counter?: string | number | React.ReactNode;
  readonly disabled?: boolean;
  readonly content?: React.ReactNode;
  readonly show?: boolean;
}
