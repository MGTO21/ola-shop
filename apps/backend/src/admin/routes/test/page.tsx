import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";

const TestPage = () => {
  return (
    <div className="p-8 bg-white border border-red-500">
      <h1 className="text-2xl font-bold text-red-600">✅ EXTENSIONS ARE WORKING!</h1>
      <p>If you see this, the build system is correct.</p>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Test Page",
  icon: ChatBubbleLeftRight,
});

export default TestPage;
