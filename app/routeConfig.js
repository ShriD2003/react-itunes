import routeConstants from '@utils/routeConstants';
import NotFound from '@app/containers/NotFoundPage/loadable';
import HomeContainer from '@app/containers/HomeContainer/loadable';

import ItunesContainer from '@app/containers/ItunesContainer/loadable';
import TrackDetails from '@app/containers/ItunesContainer/TrackDetails/Loadable';

export const routeConfig = {
  repos: {
    component: HomeContainer,
    ...routeConstants.repos
  },
  itunes: {
    component: ItunesContainer,
    ...routeConstants.itunes
  },
  details: {
    component: TrackDetails,
    ...routeConstants.trackDetails
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
