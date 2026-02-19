/**
 * Loading skeletons for Campaign Page PPR
 * These provide visual feedback while dynamic content loads
 */

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import StackComponent from "@/components/atoms/StackComponent";

// Skeleton animation styles
const skeletonPulse = {
  animation: "pulse 1.5s ease-in-out infinite",
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.4 },
    "100%": { opacity: 1 },
  },
};

const skeletonBase = {
  backgroundColor: "#e0e0e0",
  borderRadius: "4px",
  ...skeletonPulse,
};

// Campaign Media Skeleton - For cover image/video loading
export function CampaignMediaSkeleton({ height = "380px" }) {
  return (
    <BoxComponent
      sx={{
        ...skeletonBase,
        height: { xs: "200px", sm: height },
        width: "100%",
        borderRadius: "12px",
        marginBottom: "16px",
        // Aspect ratio fallback for proper CLS prevention
        aspectRatio: "16/9",
        minHeight: { xs: "180px", sm: "300px", md: height },
        maxHeight: "450px",
      }}
    />
  );
}

// Campaign Header Skeleton - For title/subtitle loading
export function CampaignHeaderSkeleton() {
  return (
    <StackComponent
      direction="column"
      alignItems="center"
      sx={{ width: "100%", mb: 2 }}
    >
      {/* Title Skeleton */}
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "48px",
          width: "70%",
          margin: "0 auto 16px auto",
        }}
      />
      {/* Subtitle Skeleton */}
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "22px",
          width: "50%",
          margin: "0 auto 16px auto",
        }}
      />
    </StackComponent>
  );
}

// Story Section Skeleton
export function CampaignStorySkeleton() {
  return (
    <StackComponent
      direction="column"
      spacing={1}
      sx={{ width: "100%", mb: 3 }}
    >
      <BoxComponent sx={{ ...skeletonBase, height: "16px", width: "100%" }} />
      <BoxComponent sx={{ ...skeletonBase, height: "16px", width: "95%" }} />
      <BoxComponent sx={{ ...skeletonBase, height: "16px", width: "90%" }} />
      <BoxComponent sx={{ ...skeletonBase, height: "16px", width: "97%" }} />
      <BoxComponent sx={{ ...skeletonBase, height: "16px", width: "85%" }} />
    </StackComponent>
  );
}

// Organizer Info Skeleton
export function OrganizerSkeleton() {
  return (
    <StackComponent
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ mb: 3, mt: 3 }}
    >
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "56px",
          width: "56px",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      />
      <StackComponent direction="column" spacing={1}>
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "22px",
            width: "150px",
          }}
        />
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "14px",
            width: "200px",
          }}
        />
      </StackComponent>
    </StackComponent>
  );
}

// Badges Skeleton
export function BadgesSkeleton() {
  return (
    <StackComponent direction="row" spacing={1} sx={{ mb: 3 }}>
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "24px",
          width: "80px",
          borderRadius: "16px",
        }}
      />
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "24px",
          width: "100px",
          borderRadius: "16px",
        }}
      />
    </StackComponent>
  );
}

// Mobile Donation Progress Skeleton - for MobileDonationProgressBar
export function MobileDonationProgressSkeleton() {
  return (
    <BoxComponent
      sx={{
        display: { xs: "block", md: "none" },
        width: "100%",
        mt: 2,
        pt: 2,
        borderTop: "1px solid #e0e0e0",
      }}
    >
      {/* Progress bar */}
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "8px",
          width: "100%",
          borderRadius: "4px",
          mb: 2,
        }}
      />
      {/* Amount and percentage */}
      <StackComponent
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "28px",
            width: "100px",
          }}
        />
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "18px",
            width: "60px",
          }}
        />
      </StackComponent>
      {/* Donate and share buttons */}
      <StackComponent direction="row" spacing={1}>
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "48px",
            flex: 1,
            borderRadius: "8px",
          }}
        />
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "48px",
            width: "48px",
            borderRadius: "8px",
          }}
        />
      </StackComponent>
    </BoxComponent>
  );
}

// Mobile Giving Levels Section Skeleton - matches GivingLevelCard structure
export function MobileGivingLevelsSkeleton() {
  return (
    <BoxComponent
      sx={{
        display: { xs: "block", md: "none" },
        width: "100%",
      }}
    >
      {/* Giving level cards */}
      <StackComponent direction="column">
        {[1, 2].map((i) => (
          <BoxComponent
            key={i}
            sx={{
              background: "white",
              borderRadius: "32px",
              padding: "32px",
              marginTop: "8px",
            }}
          >
            {/* Title and Amount row */}
            <StackComponent
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 1.5 }}
            >
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "22px",
                  width: "55%",
                }}
              />
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "22px",
                  width: "20%",
                }}
              />
            </StackComponent>

            {/* Description lines */}
            <StackComponent direction="column" spacing={0.75} sx={{ mb: 1.5 }}>
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "16px",
                  width: "100%",
                }}
              />
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "16px",
                  width: "85%",
                }}
              />
            </StackComponent>

            {/* Claimed count */}
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "14px",
                width: "70px",
                mb: 1.5,
              }}
            />

            {/* Donate button */}
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "34px",
                width: "100%",
                borderRadius: "22px",
              }}
            />
          </BoxComponent>
        ))}
      </StackComponent>
    </BoxComponent>
  );
}

// Updates Section Skeleton - For lazy loaded updates
export function UpdatesSkeleton() {
  return (
    <BoxComponent
      sx={{
        background: "white",
        borderRadius: "32px",
        padding: "32px",
        mt: 2,
      }}
    >
      {/* Section Title */}
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "32px",
          width: "120px",
          mb: 3,
        }}
      />
      {/* Update Items */}
      {[1, 2].map((i) => (
        <BoxComponent
          key={i}
          sx={{
            mb: 3,
            pb: 2,
            borderBottom: i < 2 ? "1px solid #e0e0e0" : "none",
          }}
        >
          <StackComponent direction="row" spacing={2} alignItems="flex-start">
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "40px",
                width: "40px",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <StackComponent direction="column" spacing={1} sx={{ flex: 1 }}>
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "18px",
                  width: "60%",
                }}
              />
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "14px",
                  width: "30%",
                }}
              />
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "16px",
                  width: "100%",
                  mt: 1,
                }}
              />
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "16px",
                  width: "90%",
                }}
              />
            </StackComponent>
          </StackComponent>
        </BoxComponent>
      ))}
    </BoxComponent>
  );
}

// Supporters Section Skeleton - For lazy loaded supporters
export function SupportersSkeleton() {
  return (
    <BoxComponent
      sx={{
        background: "white",
        borderRadius: "32px",
        padding: "32px",
        mt: 2,
      }}
    >
      {/* Section Title */}
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "32px",
          width: "180px",
          mb: 3,
        }}
      />
      {/* Supporter Items - 2x2 grid */}
      <StackComponent direction="row" sx={{ flexWrap: "wrap", gap: 2 }}>
        {[1, 2, 3, 4].map((i) => (
          <StackComponent
            key={i}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              mb: 1,
            }}
          >
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "46px",
                width: "46px",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            />
            <StackComponent direction="column" spacing={0.5}>
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "18px",
                  width: "100px",
                }}
              />
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "14px",
                  width: "140px",
                }}
              />
            </StackComponent>
          </StackComponent>
        ))}
      </StackComponent>
    </BoxComponent>
  );
}

// Left Side Skeleton - For Static Content Loading
export function LeftSideSkeleton() {
  return (
    <StackComponent
      direction="column"
      spacing={2}
      sx={{
        width: { xs: "100%", md: "66.33%" },
        borderRadius: "32px",
      }}
    >
      <BoxComponent
        sx={{
          background: "white",
          borderRadius: "32px",
          padding: "32px",
        }}
      >
        {/* Title Skeleton */}
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "48px",
            width: "70%",
            margin: "0 auto 16px auto",
          }}
        />

        {/* Subtitle Skeleton */}
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "22px",
            width: "50%",
            margin: "0 auto 24px auto",
          }}
        />

        {/* Cover Image Skeleton */}
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "380px",
            width: "100%",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        />

        {/* Badges Skeleton */}
        <StackComponent direction="row" spacing={1} sx={{ mb: 3 }}>
          <BoxComponent
            sx={{
              ...skeletonBase,
              height: "24px",
              width: "80px",
              borderRadius: "16px",
            }}
          />
          <BoxComponent
            sx={{
              ...skeletonBase,
              height: "24px",
              width: "100px",
              borderRadius: "16px",
            }}
          />
        </StackComponent>

        {/* Organizer Skeleton */}
        <StackComponent
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <BoxComponent
            sx={{
              ...skeletonBase,
              height: "56px",
              width: "56px",
              borderRadius: "50%",
            }}
          />
          <StackComponent direction="column" spacing={1}>
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "22px",
                width: "150px",
              }}
            />
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "14px",
                width: "200px",
              }}
            />
          </StackComponent>
        </StackComponent>

        {/* Story Skeleton */}
        <StackComponent direction="column" spacing={1}>
          <BoxComponent
            sx={{ ...skeletonBase, height: "16px", width: "100%" }}
          />
          <BoxComponent
            sx={{ ...skeletonBase, height: "16px", width: "95%" }}
          />
          <BoxComponent
            sx={{ ...skeletonBase, height: "16px", width: "90%" }}
          />
          <BoxComponent
            sx={{ ...skeletonBase, height: "16px", width: "97%" }}
          />
          <BoxComponent
            sx={{ ...skeletonBase, height: "16px", width: "85%" }}
          />
          <BoxComponent
            sx={{ ...skeletonBase, height: "16px", width: "92%" }}
          />
        </StackComponent>
      </BoxComponent>
    </StackComponent>
  );
}

// Right Side Skeleton - For Dynamic Content Loading
export function RightSideSkeleton() {
  return (
    <BoxComponent
      sx={{
        position: "relative",
        width: { xs: "100%", md: "100%" },
        display: { xs: "none", sm: "block" },
      }}
    >
      <StackComponent
        direction="column"
        sx={{
          position: "sticky",
          top: "80px",
          borderRadius: "32px",
        }}
      >
        <BoxComponent
          sx={{
            background: "white",
            borderRadius: "32px",
            padding: "32px",
          }}
        >
          {/* Progress Bar Skeleton */}
          <BoxComponent sx={{ mb: 3 }}>
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "8px",
                width: "100%",
                borderRadius: "4px",
                mb: 2,
              }}
            />
            <StackComponent direction="row" justifyContent="space-between">
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "32px",
                  width: "100px",
                }}
              />
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "20px",
                  width: "80px",
                }}
              />
            </StackComponent>
          </BoxComponent>

          {/* Supporters Count Skeleton */}
          <BoxComponent
            sx={{
              ...skeletonBase,
              height: "20px",
              width: "120px",
              mb: 3,
            }}
          />

          {/* Donate Button Skeleton */}
          <BoxComponent
            sx={{
              ...skeletonBase,
              height: "48px",
              width: "100%",
              borderRadius: "8px",
              mb: 2,
            }}
          />

          {/* Share Button Skeleton */}
          <BoxComponent
            sx={{
              ...skeletonBase,
              height: "48px",
              width: "100%",
              borderRadius: "8px",
              mb: 3,
            }}
          />

          {/* Benefits Skeleton */}
          <StackComponent direction="row" justifyContent="space-between">
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "60px",
                width: "30%",
                borderRadius: "8px",
              }}
            />
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "60px",
                width: "30%",
                borderRadius: "8px",
              }}
            />
            <BoxComponent
              sx={{
                ...skeletonBase,
                height: "60px",
                width: "30%",
                borderRadius: "8px",
              }}
            />
          </StackComponent>
        </BoxComponent>

        {/* Giving Levels Skeleton - matches GivingLevelCard structure */}
        <StackComponent direction="column" sx={{ mt: 1 }}>
          {[1, 2].map((i) => (
            <BoxComponent
              key={i}
              sx={{
                background: "white",
                borderRadius: "32px",
                padding: "32px",
                marginTop: "8px",
              }}
            >
              {/* Title and Amount row */}
              <StackComponent
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 1.5 }}
              >
                <BoxComponent
                  sx={{
                    ...skeletonBase,
                    height: "22px",
                    width: "55%",
                  }}
                />
                <BoxComponent
                  sx={{
                    ...skeletonBase,
                    height: "22px",
                    width: "20%",
                  }}
                />
              </StackComponent>

              {/* Description lines */}
              <StackComponent direction="column" spacing={0.75} sx={{ mb: 1.5 }}>
                <BoxComponent
                  sx={{
                    ...skeletonBase,
                    height: "16px",
                    width: "100%",
                  }}
                />
                <BoxComponent
                  sx={{
                    ...skeletonBase,
                    height: "16px",
                    width: "85%",
                  }}
                />
              </StackComponent>

              {/* Claimed count */}
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "14px",
                  width: "70px",
                  mb: 1.5,
                }}
              />

              {/* Donate button */}
              <BoxComponent
                sx={{
                  ...skeletonBase,
                  height: "34px",
                  width: "100%",
                  borderRadius: "22px",
                }}
              />
            </BoxComponent>
          ))}
        </StackComponent>
      </StackComponent>
    </BoxComponent>
  );
}

// Mobile Donation Bar Skeleton
export function MobileDonationBarSkeleton() {
  return (
    <BoxComponent
      sx={{
        display: { xs: "block", sm: "none" },
        background: "white",
        borderRadius: "32px",
        padding: "24px",
        mb: 2,
      }}
    >
      <BoxComponent
        sx={{
          ...skeletonBase,
          height: "8px",
          width: "100%",
          borderRadius: "4px",
          mb: 2,
        }}
      />
      <StackComponent
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "28px",
            width: "100px",
          }}
        />
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "18px",
            width: "60px",
          }}
        />
      </StackComponent>
      <StackComponent direction="row" spacing={1}>
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "48px",
            width: "75%",
            borderRadius: "8px",
          }}
        />
        <BoxComponent
          sx={{
            ...skeletonBase,
            height: "48px",
            width: "25%",
            borderRadius: "8px",
          }}
        />
      </StackComponent>
    </BoxComponent>
  );
}

// Full Page Skeleton
export function CampaignPageSkeleton() {
  return (
    <StackComponent
      direction={{ xs: "column", md: "row" }}
      spacing="24px"
      justifyContent="flex-start"
      sx={{
        maxWidth: "1120px",
        width: "100%",
        margin: "24px auto",
        minHeight: "calc(100vh - 272px)",
      }}
    >
      <RightSideSkeleton />
      <LeftSideSkeleton />
    </StackComponent>
  );
}

export default CampaignPageSkeleton;
