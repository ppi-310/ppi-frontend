import IndicatorsPage from '@/components/IndicatorsPage';

const TIME_DIMENSION_ID = 5;
type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function IndicatorsTime({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <IndicatorsPage current="time" dimensionId={TIME_DIMENSION_ID} searchParams={sp} />;
}
