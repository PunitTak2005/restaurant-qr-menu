import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MenuItemList from "../pages/MenuItemList";
import MenuItemCreate from "../pages/MenuItemCreate";
import MenuItemEdit from "../pages/MenuItemEdit";
import CategoryList from "../pages/CategoryList";
import CategoryCreate from "../pages/CategoryCreate";
import CategoryEdit from "../pages/CategoryEdit";
import TableList from "../pages/TableList";
import TableCreate from "../pages/TableCreate";
import QRPreview from "../pages/QRPreview";
import MenuView from "../pages/MenuView";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/menu-items" element={<MenuItemList />} />
      <Route path="/menu-items/create" element={<MenuItemCreate />} />
      <Route path="/menu-items/edit/:id" element={<MenuItemEdit />} />
      <Route path="/categories" element={<CategoryList />} />
      <Route path="/categories/create" element={<CategoryCreate />} />
      <Route path="/categories/edit/:id" element={<CategoryEdit />} />
      <Route path="/tables" element={<TableList />} />
      <Route path="/tables/create" element={<TableCreate />} />
      <Route path="/tables/qr/:id" element={<QRPreview />} />
      <Route path="/m/:slug" element={<MenuView />} />
    </Routes>
  );
}
export default AppRoutes;
