import { DataStateWrapper } from "@components/DataStateWrapper/DataStateWrapper";
import { useNavigation } from "@hooks/useNavigation";
import type React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MemoView } from "../../components/MemoView/MemoView";
import { useMemo } from "../../hooks";

const MemoViewPage: React.FC = () => {
	const { id } = useParams();
	const navigation = useNavigation();
	const { memo, loading, error, deleteMemo } = useMemo(id);

	useEffect(() => {
		if (!id) {
			navigation.goToList();
		}
	}, [id, navigation]);

	const handleEdit = () => {
		if (memo) {
			navigation.goToEdit(memo.id);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this memo?")) {
			const success = await deleteMemo();
			if (success) {
				navigation.goToList();
			}
		}
	};

	const handleBack = () => {
		navigation.goBack();
	};

	return (
		<div className="w-full max-w-2xl mx-auto box-border">
			<div className="px-4">
				<DataStateWrapper
					loading={loading}
					error={error || (!memo ? "Memo not found" : null)}
					loadingClassName="flex justify-center items-center py-8"
					errorClassName="text-center py-8"
					errorAction={{
						label: "Back to list",
						onClick: () => navigation.goToList(),
					}}
				>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">View memo</h1>
					{memo && (
						<MemoView
							memo={memo}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onBack={handleBack}
						/>
					)}
				</DataStateWrapper>
			</div>
		</div>
	);
};

export default MemoViewPage;
