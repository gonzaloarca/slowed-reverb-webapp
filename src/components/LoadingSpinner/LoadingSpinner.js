import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React, { useMemo } from "react";

const LoadingSpinner = ({ iconStyle = {}, ...props }) => {
	const antIcon = useMemo(
		() => <LoadingOutlined style={{ fontSize: 24, ...iconStyle }} spin />,
		[iconStyle]
	);

	return <Spin indicator={antIcon} {...props} />;
};

export default LoadingSpinner;
