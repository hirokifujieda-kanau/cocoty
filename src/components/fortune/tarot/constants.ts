import type { TarotState, Step } from './types';

export const INITIAL_TAROT_STATE: TarotState = {
  step: 'target',
  target: null,
  mentalState: null,
  selectedCardIndex: null,
  drawnCard: null,
  interpretation: '',
  userComment: '',
  isShuffling: false,
  isRevealing: false,
};

export const STEP_ORDER: Step[] = [
  'target',
  'mental',
  'shuffle',
  'select',
  'result',
  'comment',
  'history',
  'historyDetail',
];

export const HEADING_STYLE = {
  fontFamily: 'Noto Sans JP',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  background: 'linear-gradient(360deg, #EDCFAC -31.25%, #E4BC89 75%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginTop: '30px',
  marginBottom: '12px',
};

export const SUBHEADING_STYLE = {
  fontFamily: 'Noto Sans JP',
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  color: '#FFFFFF',
  marginBottom: '32px',
};

export const getButtonStyle = (isEnabled: boolean) => ({
  width: '140px',
  height: '48px',
  borderRadius: '8px',
  background: isEnabled
    ? 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)'
    : 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)',
  border: isEnabled ? '1px solid #FFB370' : '1px solid #CECECE',
  boxShadow: isEnabled
    ? '0px 4px 0px 0px #5B3500'
    : '0px 4px 0px 0px #676158',
  fontFamily: 'Noto Sans JP',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  color: '#FFFFFF',
  cursor: isEnabled ? 'pointer' : 'not-allowed',
});
