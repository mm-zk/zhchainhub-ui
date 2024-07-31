import { formatDataNumber } from '~/utils';

export interface TokenValueLocked {
  token: string;
  value: number;
}

interface TotalValueLockedProps {
  tvl: { [token: string]: number }[];
}

export const TotalValueLocked = ({ tvl }: TotalValueLockedProps) => {
  return (
    <div>
      {tvl.map((data, index) => (
        <div key={index}>
          <span>{data.token}</span>
          <span>{formatDataNumber(data.value, 0, true)}</span>
        </div>
      ))}
    </div>
  );
};