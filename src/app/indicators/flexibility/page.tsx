import IndicatorsPage from '@/components/IndicatorsPage';

const FLEXIBILITY_DIMENSION_ID = 2;
type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function IndicatorsFlexibility({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <IndicatorsPage current="flexibility" dimensionId={FLEXIBILITY_DIMENSION_ID} searchParams={sp} />;
}
