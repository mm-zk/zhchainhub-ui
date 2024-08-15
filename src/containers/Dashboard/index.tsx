import { useTranslation } from 'next-i18next';
import { Typography, styled } from '@mui/material';

import { ChainTable } from '~/components';
import { useData, useSearchContext, useCustomTheme } from '~/hooks';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { ecosystemData } = useData();
  const { searchTerm, isSearch } = useSearchContext();

  const filteredChains = ecosystemData?.zkChains.filter((chain) => {
    const chainIdStr = String(chain.chainId);
    const formattedSearchTerm = String(searchTerm).toLowerCase();

    const matchesName = chain.chainName.toLowerCase().includes(formattedSearchTerm);
    const matchesId = chainIdStr.includes(formattedSearchTerm);

    return matchesName || matchesId;
  });

  const availableChains = filteredChains?.length > 0;

  const showResults = isSearch && availableChains && searchTerm;
  const enterSearchTerm = isSearch && !searchTerm;

  return (
    <DashboardContainer>
      <header>
        {!isSearch && <h2>{t('HOME.DASHBOARD.title')}</h2>}

        {showResults && (
          <SearchLabel>{`${t(
            'HOME.DASHBOARD.searchResults',
          )} '${searchTerm}' (${filteredChains?.length})`}</SearchLabel>
        )}

        {enterSearchTerm && <SearchLabel>{t('HOME.DASHBOARD.enterSearchTerm')}</SearchLabel>}
      </header>

      {availableChains && <ChainTable chains={filteredChains} />}
      {!availableChains && <SearchLabel>{t('HOME.DASHBOARD.notFound')}</SearchLabel>}
    </DashboardContainer>
  );
};

const DashboardContainer = styled('section')(({ theme }) => {
  const { isSearch } = useSearchContext();

  return {
    width: '100%',
    minHeight: 'calc(100vh - 19rem)',
    ...(isSearch && {
      padding: '0 7rem',
      minHeight: 'calc(100vh - 11rem)',
      [theme.breakpoints.down('sm')]: {
        padding: '0 1rem',
        minHeight: 'calc(100vh - 23rem)',
      },
    }),
  };
});

const SearchLabel = styled(Typography)(() => {
  const { currentTheme } = useCustomTheme();

  return {
    color: currentTheme.textPrimary,
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.5rem',
    textAlign: 'center',
    margin: '1.5rem 0',
  };
});
