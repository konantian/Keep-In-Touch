//return a random color from a color list
export const randomColor = () => {
    const colors = ["magenta", "red", "volcano", "orange", "gold","lime","cyan","green",
                    "blue","geekblue", "purple"];
    return colors[Math.floor(Math.random() * colors.length)];
};