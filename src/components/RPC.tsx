import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { Box, Typography, Tooltip, styled, Skeleton, Button } from '@mui/material';

import { useData, useCustomTheme } from '~/hooks';
import { DataContainer, STitle, Icon, NotAvailable } from '~/components';
import { checkRpcStatus } from '~/utils';

export const RPC = () => {
  const { t } = useTranslation();
  const { chainData } = useData();
  const [rpcData, setRpcData] = useState<{ url: string; status: boolean }[]>([]);
  const [rpcIsLoading, setRpcIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const updateRpcStatuses = async () => {
      setRpcIsLoading(true);
      if (!chainData?.metadata?.publicRpcs) return;

      const updatedRpcData = await Promise.all(
        chainData.metadata.publicRpcs.map(async (rpc) => {
          const status = await checkRpcStatus(rpc);
          return { url: rpc, status };
        }),
      );

      setRpcData(updatedRpcData);
      setRpcIsLoading(false);
    };

    updateRpcStatuses();
  }, [chainData]);

  const visibleRpcData = useMemo(() => {
    return showAll ? rpcData : rpcData.slice(0, 4);
  }, [showAll, rpcData]);

  const showMoreButton = useMemo(() => {
    return rpcData.length > 4 && !rpcIsLoading;
  }, [rpcData, rpcIsLoading]);

  return (
    <article>
      <RPCTitle>
        <STitle>{t('CHAIN.RPC.title')}</STitle>
        <Subtitle>{t('CHAIN.RPC.subtitle')}</Subtitle>
      </RPCTitle>

      <DataContainer aria-live='polite' aria-busy={rpcIsLoading}>
        {rpcIsLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <RPCBox key={index}>
              <Skeleton variant='circular' width={20} height={20} />
              <Skeleton variant='text' width='100%' />
            </RPCBox>
          ))}

        {!rpcIsLoading &&
          visibleRpcData.map((rpc, index) => (
            <RPCBox
              key={index}
              aria-label={`${rpc.url} - ${rpc.status ? t('CHAIN.RPC.statusActive') : t('CHAIN.RPC.statusInactive')}`}
            >
              {rpc.status && (
                <Tooltip title={t('CHAIN.RPC.statusActive')}>
                  <RPCIcon hidden={false}>
                    <Icon icon='check' alt='Check icon representing active RPC' size={20} />
                  </RPCIcon>
                </Tooltip>
              )}

              {!rpc.status && (
                <Tooltip title={t('CHAIN.RPC.statusInactive')}>
                  <RPCIcon hidden={false}>
                    <Icon icon='error' alt='Error icon representing inactive RPC' size={20} />
                  </RPCIcon>
                </Tooltip>
              )}

              <RPCUrl>{rpc.url}</RPCUrl>
            </RPCBox>
          ))}

        {!rpcIsLoading && rpcData.length === 0 && (
          <RPCBox>
            <NotAvailable>{t('CHAIN.CHAININFORMATION.notAvailable')}</NotAvailable>
          </RPCBox>
        )}
      </DataContainer>

      {showMoreButton && (
        <RPCButtonContainer>
          <RPCButton onClick={() => setShowAll(!showAll)}>
            {showAll && t('CHAIN.RPC.showLess')}

            {!showAll && t('CHAIN.RPC.showMore')}
          </RPCButton>
        </RPCButtonContainer>
      )}
    </article>
  );
};

const RPCTitle = styled(Box)(() => {
  return {
    display: 'flex',
    gap: '0.625rem',
    alignItems: 'baseline',
  };
});

const Subtitle = styled(Typography)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.textSecondary,
  };
});

const RPCBox = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    gap: currentTheme.gap,
    height: '4.5rem',
    alignItems: 'center',
    padding: currentTheme.padding,
  };
});

const RPCIcon = styled(Box)(() => {
  return {
    display: 'flex',
    alignItems: 'center',
  };
});

const RPCUrl = styled(Typography)(({ theme }) => {
  const { currentTheme } = useCustomTheme();
  return {
    textDecoration: 'underline',
    textUnderlineOffset: currentTheme.gap,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '15rem',
    [theme.breakpoints.down('md')]: {
      maxWidth: '25rem',
    },
  };
});

const RPCButtonContainer = styled(Box)(() => {
  return {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  };
});

const RPCButton = styled(Button)(() => {
  const { currentTheme, theme } = useCustomTheme();

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme === 'dark' ? currentTheme.backgroundSecondary : currentTheme.backgroundTertiary,
    borderRadius: currentTheme.borderRadius,
    padding: '0.5rem 1rem',
    color: currentTheme.textPrimary,
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: '1rem',
    gap: '0.5rem',
    lineHeight: '1.5rem',
    textDecoration: 'none',
    '&:hover': {
      background: theme === 'dark' ? currentTheme.neutral[800] : currentTheme.neutral[300],
      boxShadow: 'none',
    },
  };
});
