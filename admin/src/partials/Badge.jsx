import React from "react";

function Badge({ children, type = "green" }) {
    const types = {
        green: "qualified",
        orange: "proposal",
        blue: "new",
        purple: "renewal",
        red: "unqualified",
    };

    return <span className={`customer-badge status-${types[type]}`}>{children}</span>;
}

export default Badge;
