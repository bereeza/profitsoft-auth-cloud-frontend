import React, {useEffect, useState} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { addAxiosInterceptors } from 'misc/requests';
import * as pages from 'constants/pages';
import AuthoritiesProvider from 'misc/providers/AuthoritiesProvider';
import DefaultPage from 'pageProviders/Default';
import Loading from 'components/Loading';
import LoginPage from 'pageProviders/Login';
import PageContainer from 'pageProviders/components/PageContainer';
import pageURLs from 'constants/pagesURLs';
import SecretPage from 'pageProviders/Secret';
import SongDetails from 'pageProviders/EntityDetails';
import SongList from 'pageProviders/EntityList';
import ThemeProvider from 'misc/providers/ThemeProvider';
import UserProvider from 'misc/providers/UserProvider';

import actionsUser from '../actions/user';
import Header from '../components/Header';
import IntlProvider from '../components/IntlProvider';
import MissedPage from '../components/MissedPage';
import SearchParamsConfigurator from '../components/SearchParamsConfigurator';

function App() {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    componentDidMount: false,
  });

  const {
    isFetchingUser,
  } = useSelector(({ user }) => user);

  useEffect(() => {
    addAxiosInterceptors({
      onSignOut: () => dispatch(actionsUser.fetchSignOut()),
    });
    dispatch(actionsUser.fetchUser());
    setState({
      ...state,
      componentDidMount: true,
    });
  }, []);

  return (
    <UserProvider>
      <AuthoritiesProvider>
        <ThemeProvider>
          <BrowserRouter>
            <SearchParamsConfigurator />
            {state.componentDidMount && (
              <IntlProvider>
                <Header onLogout={() => dispatch(actionsUser.fetchSignOut())} />
                {isFetchingUser && (
                  <PageContainer>
                    <Loading />
                  </PageContainer>
                )}
                {!isFetchingUser && (
                  <Routes>
                    <Route
                      element={<DefaultPage />}
                      path={`${pageURLs[pages.defaultPage]}`}
                    />
                    <Route
                      element={<SecretPage />}
                      path={`${pageURLs[pages.secretPage]}`}
                    />
                    <Route
                        element={<SongList />}
                        path={`${pageURLs[pages.songListPage]}`}
                    />
                    <Route
                        element={<SongDetails />}
                        path={`${pageURLs[pages.songDetailsPage]}`}
                    />

                    <Route
                        action={()=>actionsUser.fetchSignIn()}
                      element={(
                        <LoginPage
                          onSignIn={() => dispatch(actionsUser.fetchSignIn())}
                        />
                      )}

                      path={`${pageURLs[pages.login]}`}
                    />
                    <Route
                      element={(
                        <MissedPage
                          redirectPage={`${pageURLs[pages.defaultPage]}`}
                        />
                      )}
                      path="*"
                    />
                  </Routes>
                )}
              </IntlProvider>
            )}
          </BrowserRouter>
        </ThemeProvider>
      </AuthoritiesProvider>
    </UserProvider>
  );
}

export default App;
