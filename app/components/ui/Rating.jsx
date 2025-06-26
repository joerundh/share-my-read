export default function Rating({ value }) {
    return (
        <div className={"w-fit flex flex-row gap-3 items-center"}>
            <div className={"flex flex-row"}>
            {
                new Array(5).fill(0)
                        .map((x, index) => index + 1)
                        .map(x => (
                                <Image key={x} src={
                                    x <= value ? "./assets/star-icon.png" : "./assets/star-empty-icon.png"
                                } className={"w-[20px] h-[20px]"} />
                        ))
            }
            </div>
            <span>
                {
                    value ? `${value}/5` : "No rating"
                }
            </span>
        </div>
    );
}