import React, { FC, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loading from "~/components/common/Loading";

import { checkCookieToken, useAppDispatch, useAppSelector } from "~/redux";
import { ASYNC_STATUS } from "~/redux";

const withAuth = (Component: FC) => {
  const AuthenticatedComponent = () => {
    const user = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (user.status === ASYNC_STATUS.IDLE) {
        dispatch(checkCookieToken());
      }
    }, [dispatch, user.status]);

    if (
      user.status === ASYNC_STATUS.IDLE ||
      user.status === ASYNC_STATUS.LOADING
    ) {
      return <Loading />;
    }

    if (user.status === ASYNC_STATUS.FAILED) {
      return <Navigate to="/login" replace />;
    }

    return <Component />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
