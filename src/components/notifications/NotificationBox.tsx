import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { NotificationProps } from "pages/notifications";
import { useNavigate } from "react-router-dom";

export default function NotificationBox({
  notification,
}: {
  notification: NotificationProps;
}) {
  const navigate = useNavigate();

  const onClickNotification = async (url: string) => {
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });
    navigate(url);
  };

  return (
    <div className="notifications">
      <div
        className="notification"
        key={notification.id}
        onClick={() => onClickNotification(notification?.url)}
      >
        <div>
          <div className="notification-content">{notification?.content}</div>
          <div className="notification-createdAt">
            {notification?.createdAt}
          </div>
        </div>
        <div className="notification-isRead">
          {notification?.isRead === false && (
            <div className="notification-isRead-unread"></div>
          )}
        </div>
      </div>
    </div>
  );
}
