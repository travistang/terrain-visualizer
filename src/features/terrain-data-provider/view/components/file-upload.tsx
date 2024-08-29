type Props = {
  onFileSelected: (file: Blob) => void;
  className?: string;
  accept?: string;
};
export const FileUpload = ({ accept, onFileSelected, className }: Props) => {
  return (
    <input
      type="file"
      onChange={(e) => onFileSelected(e.target.files![0])}
      accept={accept}
      className={className}
    />
  );
};
