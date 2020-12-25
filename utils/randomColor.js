export const randomColor = () => {
    const colors = ["magenta", "red", "volcano", "orange", "gold","lime","cyan","green",
                    "blue","geekblue", "purple","#f5222d","#fa541c","#fa8c16","#faad14",
                    "#fadb14","#a0d911","#52c41a","#13c2c2","#1890ff","#ffc53d","#ffec3d",
                    "#bae637","#73d13d","#36cfc9","#40a9ff","#9254de","#f759ab"];
    return colors[Math.floor(Math.random() * colors.length)];
};