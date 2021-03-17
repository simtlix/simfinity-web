import React from "react";
import { Layout, Menu } from "antd";
import "./App.css";

const App = () => {
  const { Header, Content, Footer, Sider } = Layout;
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={true}>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
            <Menu.Item key="9">Files</Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <h1>Welcome!</h1>
          </Content>
          <Footer style={{ textAlign: "center" }}>Simtlix ©2021</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
