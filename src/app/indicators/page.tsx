import IndicatorsPage from '@/components/IndicatorsPage';

const GENERAL_DIMENSION_ID = 3;
type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function IndicatorsGeneral({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <IndicatorsPage
      current="general"
      dimensionId={GENERAL_DIMENSION_ID}
      searchParams={sp}
    />
  );
}
