import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Styled } from "direflow-component";
import styles from "./App.css";
import TableOfEntities from "./Table";

const App = () => {
  const { Header, Content, Footer, Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  return (
    <Styled styles={styles}>
      <div>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="1">Entidades</Menu.Item>
              <Menu.Item key="2">Option 1</Menu.Item>
              <Menu.Item key="3">Option 2</Menu.Item>
              <Menu.Item key="9">Files</Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: "0 16px" }}>
              <h1>Welcome!</h1>
              <TableOfEntities/>
            </Content>
            <Footer style={{ textAlign: "center" }}>Simtlix ©2021</Footer>
          </Layout>
        </Layout>
      </div>
    </Styled>
  );
};

export default App;
