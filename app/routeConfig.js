import routeConstants from '@utils/routeConstants';
import NotFound from '@app/containers/NotFoundPage/loadable';
import HomeContainer from '@app/containers/HomeContainer/loadable';

import ItunesContainer from '@app/containers/ItunesContainer/loadable';

export const routeConfig = {
  repos: {
    component: HomeContainer,
    ...routeConstants.repos
  },
  itunes: {
    component: ItunesContainer,
    ...routeConstants.itunes
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
