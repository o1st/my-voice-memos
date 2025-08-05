import { useNavigation } from "@hooks/useNavigation";

import type React from "react";
import { useState } from "react";
import { MemoForm } from "../../components/MemoForm/MemoForm";
import { memosService } from "../../services/memosService";

const NewMemoPage: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigation = useNavigation();

	const handleCreate = async (data: any) => {
		setIsSubmitting(true);

		try {
			const result = await memosService.createMemo({
				title: data.title.trim(),
				description: data.description.trim(),
			});

			if (result.success && result.data) {
				navigation.goToView(result.data.id);
			} else {
				alert(`Error creating memo: ${result.error}`);
			}
		} catch (error) {
			alert("An unexpected error occurred while creating memo");
			console.error("Error creating memo:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full max-w-2xl mx-auto box-border">
			<div className="px-4">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Create memo</h1>
				<p className="text-gray-600 mb-4">
					You can use keyboard or speech input to create a new memo.
				</p>
				<MemoForm onSubmit={handleCreate} isReadOnly={isSubmitting} />
			</div>
		</div>
	);
};

export default NewMemoPage;
