import IndicatorsPage from '@/components/IndicatorsPage';

const QUALITY_DIMENSION_ID = 4;
type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function IndicatorsQuality({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <IndicatorsPage current="quality" dimensionId={QUALITY_DIMENSION_ID} searchParams={sp} />;
}
