type Props = {
  image: string;
};

export default function UserAvatar({ image }: Props) {
  return (
    <img
      src={image}
      alt="User"
      className="w-20 h-20 rounded-full border-4 border-gray-950 object-cover"
    />
  );
}