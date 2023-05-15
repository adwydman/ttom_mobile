import { useEffect } from 'react';

const useAsyncEffect = (asyncEffect, dependencies) => {
  useEffect(() => {
    const asyncEffectWrapper = async () => {
      await asyncEffect();
    };
    asyncEffectWrapper();
  }, dependencies);
};

export default useAsyncEffect;
