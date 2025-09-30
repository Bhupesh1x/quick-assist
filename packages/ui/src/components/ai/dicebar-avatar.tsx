import { useMemo } from "react";
import { glass } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

import { Avatar, AvatarImage } from "@workspace/ui/components/avatar";

interface Props {
  seed: string;
  size?: number;
  className?: string;
  badgeClassName?: string;
  imageUrl?: string;
  badgeImageUrl?: string;
}

export function DicebarAvatar({
  seed,
  size = 32,
  className = "",
  badgeClassName = "",
  imageUrl,
  badgeImageUrl,
}: Props) {
  const avatarUrl = useMemo(() => {
    if (imageUrl) {
      return imageUrl;
    }

    const avatar = createAvatar(glass, {
      seed: seed?.toLowerCase()?.trim(),
      size,
    });

    return avatar?.toDataUri() || "";
  }, [size, seed]);

  const badgeSize = Math.round(size * 0.5);

  return (
    <div
      className={`inline-block relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Avatar style={{ width: size, height: size }}>
        <AvatarImage alt="Avatar" src={avatarUrl} />
      </Avatar>

      {!!badgeImageUrl && (
        <div
          className={`absolute right-0 bottom-0 flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background ${badgeClassName}`}
          style={{
            width: badgeSize,
            height: badgeSize,
            transform: "translate(15%, 15%)",
          }}
        >
          <img
            alt="Badge"
            src={badgeImageUrl}
            className="h-full w-full object-cover"
            height={badgeSize}
            width={badgeSize}
          />
        </div>
      )}
    </div>
  );
}
