import { initialLoaderState } from '../../../state/utils/loader/loader.reducer';
import { serializePageContext } from '../../../util/serialization-utils';
import { CmsActions } from '../actions/index';
import { ComponentsContext } from '../cms-state';

export const initialState: ComponentsContext = {
  component: undefined,
  pageContext: {},
};

export function reducer<T>(
  state = initialState,
  action: CmsActions.CmsComponentAction<T>
): ComponentsContext {
  const context = serializePageContext(action.pageContext);
  switch (action.type) {
    case CmsActions.LOAD_CMS_COMPONENT: {
      return {
        ...state,
        pageContext: {
          ...state.pageContext,
          [context]: {
            ...initialLoaderState,
            loading: true,
            value: false,
          },
        },
      };
    }
    case CmsActions.LOAD_CMS_COMPONENT_FAIL: {
      return {
        ...state,
        pageContext: {
          ...state.pageContext,
          [context]: {
            ...initialLoaderState,
            error: true,
            value: false,
          },
        },
      };
    }
    case CmsActions.CMS_GET_COMPONENET_FROM_PAGE:
    case CmsActions.LOAD_CMS_COMPONENT_SUCCESS: {
      return {
        ...state,
        component: action.payload as T,
        pageContext: {
          ...state.pageContext,
          [context]: {
            ...initialLoaderState,
            success: true,
            value: true,
          },
        },
      };
    }
  }
  return state;
}
