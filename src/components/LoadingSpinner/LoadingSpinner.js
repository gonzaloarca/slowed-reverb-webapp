import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React, { useMemo } from "react";

const LoadingSpinner = ({
	iconStyle = {},
	fontSize = 24,
	size = undefined,
	...props
}) => {
	const antIcon = useMemo(
		() => <LoadingOutlined style={{ fontSize, ...iconStyle }} spin />,
		[iconStyle, fontSize]
	);

	return <Spin indicator={antIcon} size={size} {...props} />;
};

export default LoadingSpinner;
