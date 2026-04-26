import IndicatorsPage from '@/components/IndicatorsPage';

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function IndicatorsGeneral({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <IndicatorsPage current="general" dimensionId={null} searchParams={sp} />;
}
