import IndicatorsPage from '@/components/IndicatorsPage';

const COST_DIMENSION_ID = 1;
type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function IndicatorsCost({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <IndicatorsPage current="cost" dimensionId={COST_DIMENSION_ID} searchParams={sp} />;
}
