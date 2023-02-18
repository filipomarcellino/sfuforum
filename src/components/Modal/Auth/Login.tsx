import { Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const onSubmit = () => {};

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input required name="email" placeholder="email" mb={2} onChange={onChange} />
      <Input
        name="password"
        placeholder="password"
        mb={2}
        onChange={onChange}
      />
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
       >
        Login
      </Button>
    </form>
  );
};
export default Login;
